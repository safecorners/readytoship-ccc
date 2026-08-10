"use client";

import { useSyncExternalStore } from "react";

import { PROGRESS_STORAGE_KEY } from "@/lib/progress-keys";

/**
 * 완료 상태 스토어.
 *
 * 완료 상태를 구독하는 지점(체크 원, 챕터 카운터, 챕터 카드, 목차, 학습 경로
 * 항목)은 트리에서 서로 멀리 떨어져 있다. Context로 감싸면 가이드 상세의
 * 대부분이 클라이언트 경계로 끌려오므로, 외부 스토어를 두고 구독하는 잎
 * 컴포넌트만 클라이언트로 남긴다(`design.md` 결정 4).
 */

/** 가이드 slug → 완료 표시된 체크 단위 id 목록 */
export type ProgressState = Readonly<Record<string, readonly string[]>>;

const EMPTY_STATE: ProgressState = Object.freeze({});

/**
 * `getSnapshot()`이 돌려줄 참조. 매번 새 객체를 만들면 React가 변경으로 보고
 * 무한 렌더에 빠지므로, 실제로 바뀔 때만 새 객체로 교체한다.
 */
let cache: ProgressState | null = null;

const listeners = new Set<() => void>();

function parse(raw: string | null): ProgressState {
  if (raw === null) return EMPTY_STATE;

  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return EMPTY_STATE;
  }

  // 손상된 값이 섞여 있어도 읽을 수 있는 부분만 살린다. 진행 상황은
  // 잃어도 되는 데이터지만 화면이 멈추면 안 된다.
  const next: Record<string, readonly string[]> = {};
  for (const [slug, ids] of Object.entries(parsed)) {
    if (!Array.isArray(ids)) continue;
    next[slug] = ids.filter((id): id is string => typeof id === "string");
  }
  return next;
}

function readStorage(): ProgressState {
  try {
    return parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
  } catch {
    // 저장소 접근이 막혔거나(비공개 모드) 값이 JSON이 아니다.
    // 진행 상황만 비고 튜토리얼은 그대로 열람 가능해야 한다.
    return EMPTY_STATE;
  }
}

function getSnapshot(): ProgressState {
  cache ??= readStorage();
  return cache;
}

/** 서버에는 브라우저 저장소가 없다. 깜빡임은 부트 스크립트가 지운다 */
function getServerSnapshot(): ProgressState {
  return EMPTY_STATE;
}

function emit(): void {
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent): void {
  // `key === null`은 저장소 전체가 비워진 경우다.
  if (event.key !== null && event.key !== PROGRESS_STORAGE_KEY) return;
  cache = readStorage();
  emit();
}

function subscribe(onStoreChange: () => void): () => void {
  // 탭 간 동기화는 `storage` 이벤트가, 같은 탭 안의 전파는 listeners가 맡는다.
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
  }
  listeners.add(onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

/** 완료 표시를 뒤집는다. 저장에 실패해도 화면 상태는 즉시 반영된다 */
export function toggleUnit(guideSlug: string, unitId: string): void {
  const current = getSnapshot();
  const doneIds = current[guideSlug] ?? [];
  const nextIds = doneIds.includes(unitId)
    ? doneIds.filter((id) => id !== unitId)
    : [...doneIds, unitId];

  cache = { ...current, [guideSlug]: nextIds };

  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // 쓰기가 차단된 환경(비공개 모드, 용량 초과). 이번 세션의 화면은 계속
    // 동작하고 다음 방문에 남지 않을 뿐이다.
  }

  emit();
}

/* 집계 헬퍼 — 스토어 밖에서도 쓸 수 있도록 순수 함수로 둔다 */

export function isUnitDone(
  state: ProgressState,
  guideSlug: string,
  unitId: string
): boolean {
  return state[guideSlug]?.includes(unitId) ?? false;
}

export function countDone(
  state: ProgressState,
  guideSlug: string,
  unitIds: readonly string[]
): number {
  const doneIds = state[guideSlug];
  if (doneIds === undefined) return 0;
  return unitIds.reduce(
    (total, id) => (doneIds.includes(id) ? total + 1 : total),
    0
  );
}

/*
  훅은 원시값만 돌려준다. 객체를 만들어 돌려주면 `getSnapshot()`이 매번 새
  참조를 반환해 무한 렌더가 된다.
*/

export function useUnitDone(guideSlug: string, unitId: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isUnitDone(getSnapshot(), guideSlug, unitId),
    () => isUnitDone(getServerSnapshot(), guideSlug, unitId)
  );
}

export function useDoneCount(
  guideSlug: string,
  unitIds: readonly string[]
): number {
  return useSyncExternalStore(
    subscribe,
    () => countDone(getSnapshot(), guideSlug, unitIds),
    () => countDone(getServerSnapshot(), guideSlug, unitIds)
  );
}
