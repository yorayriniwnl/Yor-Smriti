export function SceneEyebrow({ text }: { text: string }) {
  return (
    <p
      className="uppercase tracking-[0.16em]"
      style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: '0.66rem',
        opacity: 0.82,
      }}
    >
      {text}
    </p>
  );
}
