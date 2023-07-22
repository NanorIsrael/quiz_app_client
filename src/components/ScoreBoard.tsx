export default function ScoreBoard({ score }: { score: number }) {
  return (
    <section className="App flex justify-center items-center">
      <>You scored: {score > 0 ? <>{score}%</> : { score }}</>
    </section>
  );
}
