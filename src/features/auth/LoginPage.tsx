import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      <div className="w-full max-w-[360px]">
        <div className="mb-10 text-center">
          <img src="/favicon.svg" alt="" className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-xl font-light tracking-[0.2em] uppercase text-text-primary">Phil @ Workboard</h1>
          <div className="w-12 h-px bg-white/10 mx-auto mt-3" />
        </div>

        <div className="bg-bg-secondary border border-border rounded p-6">
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
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
            {error && <p className="text-[11px] text-danger">{error}</p>}
            <Button variant="primary" className="w-full justify-center mt-1" disabled={loading}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-[11px] text-text-muted mt-4 text-center tracking-wide">
            {mode === 'login' ? (
              <>No account? <button className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Have an account? <button className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => setMode('login')}>Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
