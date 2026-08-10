// 게이트 검증용 임시 파일. react/jsx-key(error)를 일부러 위반한다.
// 빌드는 통과하고 lint만 실패해야 lint 체크가 독립적으로 일한다는 게 증명된다.
export function GateCheck({ items }: { items: string[] }) {
  return <ul>{items.map((item) => <li>{item}</li>)}</ul>;
}
