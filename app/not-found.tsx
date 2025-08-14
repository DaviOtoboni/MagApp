export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Página não encontrada</p>
        <a href="/" className="text-primary hover:underline">
          Voltar ao início
        </a>
      </div>
    </div>
  )
}