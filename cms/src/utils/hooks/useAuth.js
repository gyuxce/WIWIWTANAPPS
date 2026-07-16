import { useSelector, useDispatch } from 'react-redux';
import { initialState, setUser } from 'store/auth/userSlice';
import { apiSignIn, apiSignOut, apiSignUp, apiUserMe } from 'services/AuthService';
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice';
import appConfig from 'configs/app.config';
import { REDIRECT_URL_KEY } from 'constants/app.constant';
import { useNavigate } from 'react-router-dom';
import useQuery from './useQuery';

function useAuth() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { access_token, refresh_token, signedIn } = useSelector((state) => state.auth.session);
  const { dataUser, authority } = useSelector((state) => state.auth.user);

  const signIn = async (values) => {
    try {
      const rememberMe = values.rememberMe;
      delete values.rememberMe;

      const resp = await apiSignIn(values);
      if (resp.data.data) {
        window.localStorage.removeItem('admin');
        dispatch(
          onSignInSuccess({
            access_token: resp.data?.data?.access_token || '',
            access_token_expires_at: resp.data?.data?.access_token_expires_at || '',
            refresh_token: resp.data?.data?.refresh_token || '',
            refresh_token_expires_at: resp.data?.data?.refresh_token_expires_at || '',
            session_id: resp.data?.data?.session_id || '',
            remember_me: rememberMe || '',
          }),
        );
        dispatch(setUser(resp?.data?.data));

        setTimeout(() => {
          navigate(appConfig.authenticatedEntryPath);
        }, 3000);
      }

      return {
        status: resp?.data?.status || 'success',
        message: resp?.data?.message || '',
      };
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const userMe = async () => {
    try {
      const resp = await apiUserMe();
      if (resp.data) {
        const { data } = resp;

        if (data.data) {
          const tempData = {
            email: data?.data?.email,
            name: data?.data?.name,
            username: data?.data?.username,
            role: data?.data?.role?.name,
          };

          dispatch(setUser(tempData));
        }
        return {
          status: 'success',
          message: '',
          data: data.data,
        };
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async (values) => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data) {
        const { access_token } = resp.data;
        dispatch(onSignInSuccess(access_token));
        if (resp.data.user) {
          dispatch(
            setUser(
              resp.data.user || {
                avatar: '',
                userName: 'Anonymous',
                authority: ['USER'],
                email: '',
              },
            ),
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: 'success',
          message: '',
        };
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    navigate(appConfig.unAuthenticatedEntryPath);
    window.location.reload();
  };

  const signOut = async () => {
    await apiSignOut({ refresh_token: refresh_token });
    handleSignOut();
  };

  return {
    authenticated: access_token && signedIn,
    signIn,
    signUp,
    signOut,
    dataUser,
    access_token,
    userMe,
    authority,
  };
}

export default useAuth;
