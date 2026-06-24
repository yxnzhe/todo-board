import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail } from 'lucide-react';

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
