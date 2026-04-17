import authReducer, { clearError, logout, setAuth, registerUser } from './authSlice';

const initialState = { user: null, token: null, isLoading: false, error: null };

describe('authSlice', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@init' })).toEqual(initialState);
  });

  describe('setAuth', () => {
    it('stores user and token', () => {
      const state = authReducer(
        initialState,
        setAuth({ user: { id: '1', email: 'a@b.com' }, token: 'tok' })
      );
      expect(state.user).toEqual({ id: '1', email: 'a@b.com' });
      expect(state.token).toBe('tok');
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('resets error to null', () => {
      const state = authReducer({ ...initialState, error: 'some error' }, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears user and token', () => {
      const loggedIn = {
        user: { id: '1', email: 'a@b.com' },
        token: 'tok',
        isLoading: false,
        error: null,
      };
      const state = authReducer(loggedIn, logout());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('registerUser async thunk', () => {
    it('sets isLoading true when pending', () => {
      const state = authReducer(
        initialState,
        registerUser.pending('', { email: '', password: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('stores user and token on fulfilled', () => {
      const payload = {
        user: { id: '1', email: 'a@b.com', createdAt: '', updatedAt: '' },
        token: 'tok',
      };
      const state = authReducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(payload, '', { email: 'a@b.com', password: 'pass' })
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.token).toBe('tok');
    });

    it('stores error message on rejected', () => {
      const state = authReducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(null, '', { email: '', password: '' }, 'Email already registered')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Email already registered');
    });
  });
});
