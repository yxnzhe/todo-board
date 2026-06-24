import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, GitBranch, Mail } from 'lucide-react';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = mode === 'login'
        ? await authService.signInWithEmail(email, password)
        : await authService.signUpWithEmail(email, password);
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <h1 className="text-lg font-semibold text-text-primary">Workboard</h1>
          </div>
          <p className="text-xs text-text-muted">Personal productivity command center</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-5">
          <div className="flex flex-col gap-2 mb-4">
            <Button variant="secondary" className="w-full justify-center" onClick={() => authService.signInWithGoogle()}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full justify-center" onClick={() => authService.signInWithGitHub()}>
              <GitBranch size={14} />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-bg-secondary px-2 text-[10px] text-text-muted uppercase tracking-wider">or</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <p className="text-xs text-danger">{error}</p>}
            <Button variant="primary" className="w-full justify-center" disabled={loading}>
              <Mail size={14} />
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-[11px] text-text-muted mt-3 text-center">
            {mode === 'login' ? (
              <>No account? <button className="text-accent hover:underline cursor-pointer" onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Have an account? <button className="text-accent hover:underline cursor-pointer" onClick={() => setMode('login')}>Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
