/**
 * 튜토리얼 콘텐츠의 데이터 모델.
 *
 * MDX 파일은 `tsc`가 검사하지 않는다 — `@types/mdx`가 export를 `any`로 준다.
 * 따라서 아래 타입과 `defineGuideMeta()`는 작성 시 IDE 힌트만 제공하고,
 * 실제 보증은 로더가 호출하는 `validateGuideMeta()`가 한다. 검증은 빌드 중
 * 서버에서 실행되므로 위반하면 빌드가 실패한다.
 */

export type GuideCommand = {
  /** 학습자가 그대로 복사해 실행할 명령 문자열 */
  command: string;
  /** 언제 왜 치는 명령인지에 대한 한 줄 설명 */
  description?: string;
};

export type GuideStep = {
  /** 가이드 안에서 유일한 식별자 */
  id: string;
  title: string;
  commands?: GuideCommand[];
};

export type GuideChapter = {
  /** 가이드 안에서 유일한 식별자 */
  id: string;
  title: string;
  summary?: string;
  /** 비워 두면 챕터 자체가 하나의 체크 단위가 된다 */
  steps?: GuideStep[];
  /** 스텝이 없는 챕터가 직접 선언하는 명령어 */
  commands?: GuideCommand[];
};

export type GuideMeta = {
  slug: string;
  title: string;
  summary: string;
  chapters: GuideChapter[];
  /** 이어질 가이드의 slug. 레지스트리에 등록된 값이어야 한다 */
  next?: string;
};

/** 작성 시 타입 힌트만 제공하는 항등 함수. 보증은 런타임 검증이 한다. */
export function defineGuideMeta(meta: GuideMeta): GuideMeta {
  return meta;
}

/**
 * 학습자가 완료 표시할 수 있는 최소 단위.
 *
 * 스텝이 있는 챕터에서는 각 스텝이, 스텝이 없는 챕터에서는 챕터 자체가
 * 체크 단위가 된다. 후자는 `implicit: true`로 표시되며 화면만 이를 구분한다 —
 * 집계·저장·토글은 체크 단위 하나의 개념만 다룬다.
 */
export type CheckUnit = {
  id: string;
  title: string;
  chapterId: string;
  implicit: boolean;
  commands: GuideCommand[];
};

export type NormalizedChapter = {
  id: string;
  title: string;
  summary?: string;
  /** 1부터 시작하는 표시용 번호 */
  order: number;
  units: CheckUnit[];
};

export type NormalizedGuide = {
  slug: string;
  title: string;
  summary: string;
  chapters: NormalizedChapter[];
  next?: string;
  /** 전체 체크 단위 수 */
  unitCount: number;
};

export class GuideContentError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(`[콘텐츠 검증] ${message}`, options);
    this.name = "GuideContentError";
  }
}

function fail(scope: string, message: string): never {
  throw new GuideContentError(`${scope}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(
  value: unknown,
  scope: string,
  field: string
): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(scope, `\`${field}\`는 비어 있지 않은 문자열이어야 합니다`);
  }
  return value;
}

function readCommands(raw: unknown, scope: string): GuideCommand[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    fail(scope, "`commands`는 배열이어야 합니다");
  }

  return raw.map((entry, index) => {
    const commandScope = `${scope} · 명령어 ${index + 1}`;
    if (!isRecord(entry)) {
      fail(commandScope, "명령어는 객체여야 합니다");
    }
    // 빈 문자열이나 공백뿐인 명령어는 복사해도 아무 일이 일어나지 않는다.
    // requireNonEmptyString이 두 경우를 함께 거른다.
    const command = requireNonEmptyString(
      entry.command,
      commandScope,
      "command"
    );
    const description =
      entry.description === undefined
        ? undefined
        : requireNonEmptyString(entry.description, commandScope, "description");

    return { command: command.trim(), description };
  });
}

/**
 * 구조를 검증하고 체크 단위로 정규화한다.
 *
 * @param raw MDX가 export한 `meta`. 타입이 보장되지 않으므로 `unknown`으로 받는다.
 * @param knownSlugs 레지스트리에 등록된 가이드 slug 목록. `next` 참조 검사용.
 */
export function validateGuideMeta(
  raw: unknown,
  knownSlugs: readonly string[]
): NormalizedGuide {
  if (!isRecord(raw)) {
    throw new GuideContentError(
      "가이드가 `export const meta`를 내보내지 않았거나 객체가 아닙니다"
    );
  }

  const slug = requireNonEmptyString(raw.slug, "가이드", "slug");
  const scope = `가이드 "${slug}"`;
  const title = requireNonEmptyString(raw.title, scope, "title");
  const summary = requireNonEmptyString(raw.summary, scope, "summary");

  if (!Array.isArray(raw.chapters) || raw.chapters.length === 0) {
    fail(scope, "`chapters`에 챕터가 하나 이상 있어야 합니다");
  }

  // 챕터 id와 스텝 id는 한 네임스페이스를 공유한다. 스텝 없는 챕터의 암묵
  // 체크 단위가 챕터 id를 그대로 쓰기 때문에, 둘이 겹치면 저장 키가 충돌한다.
  const seenIds = new Map<string, string>();
  const claimId = (id: string, location: string) => {
    const firstUse = seenIds.get(id);
    if (firstUse) {
      fail(
        `${scope} · ${location}`,
        `식별자 "${id}"가 중복됩니다 (이미 ${firstUse}에서 사용)`
      );
    }
    seenIds.set(id, location);
  };

  const chapters: NormalizedChapter[] = raw.chapters.map(
    (rawChapter, chapterIndex) => {
      const order = chapterIndex + 1;
      const chapterScope = `${scope} · 챕터 ${order}`;
      if (!isRecord(rawChapter)) {
        fail(chapterScope, "챕터는 객체여야 합니다");
      }

      const chapterId = requireNonEmptyString(rawChapter.id, chapterScope, "id");
      claimId(chapterId, `챕터 ${order}`);

      const namedScope = `${scope} · 챕터 "${chapterId}"`;
      const chapterTitle = requireNonEmptyString(
        rawChapter.title,
        namedScope,
        "title"
      );
      const chapterSummary =
        rawChapter.summary === undefined
          ? undefined
          : requireNonEmptyString(rawChapter.summary, namedScope, "summary");

      const rawSteps = rawChapter.steps;
      if (rawSteps !== undefined && !Array.isArray(rawSteps)) {
        fail(namedScope, "`steps`는 배열이어야 합니다");
      }

      // 스텝이 없는 챕터는 챕터 자체를 체크 단위 하나로 정규화한다.
      if (rawSteps === undefined || rawSteps.length === 0) {
        return {
          id: chapterId,
          title: chapterTitle,
          summary: chapterSummary,
          order,
          units: [
            {
              id: chapterId,
              title: chapterTitle,
              chapterId,
              implicit: true,
              commands: readCommands(rawChapter.commands, namedScope),
            },
          ],
        };
      }

      const units: CheckUnit[] = rawSteps.map((rawStep, stepIndex) => {
        const positionalScope = `${namedScope} · 스텝 ${stepIndex + 1}`;
        if (!isRecord(rawStep)) {
          fail(positionalScope, "스텝은 객체여야 합니다");
        }

        const stepId = requireNonEmptyString(rawStep.id, positionalScope, "id");
        claimId(stepId, `챕터 ${order}의 스텝 ${stepIndex + 1}`);

        const stepScope = `${scope} · 스텝 "${stepId}"`;
        return {
          id: stepId,
          title: requireNonEmptyString(rawStep.title, stepScope, "title"),
          chapterId,
          implicit: false,
          commands: readCommands(rawStep.commands, stepScope),
        };
      });

      return {
        id: chapterId,
        title: chapterTitle,
        summary: chapterSummary,
        order,
        units,
      };
    }
  );

  let next: string | undefined;
  if (raw.next !== undefined) {
    next = requireNonEmptyString(raw.next, scope, "next");
    if (!knownSlugs.includes(next)) {
      fail(
        scope,
        `다음 가이드로 "${next}"를 가리키지만 레지스트리에 등록되지 않았습니다`
      );
    }
    if (next === slug) {
      fail(scope, "다음 가이드가 자기 자신을 가리킵니다");
    }
  }

  return {
    slug,
    title,
    summary,
    chapters,
    next,
    unitCount: chapters.reduce((total, ch) => total + ch.units.length, 0),
  };
}
