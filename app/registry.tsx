// styled-jsx was previously imported here but is not installed or used anywhere
// in this project. This is a lightweight passthrough wrapper that satisfies the
// import in app/layout.tsx with zero dependencies.
//
// If you intentionally add styled-jsx to package.json in the future, restore
// the StyleRegistry pattern from git history.

interface StyledJsxRegistryProps {
  children: React.ReactNode;
}

export default function StyledJsxRegistry({ children }: StyledJsxRegistryProps) {
  return <>{children}</>;
}
