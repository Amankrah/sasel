export const metadata = {
  title: 'SASEL Lab CMS',
  description: 'Content Management System for SASEL Lab',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen w-full">{children}</div>
}
