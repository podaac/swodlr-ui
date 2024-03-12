import { ReactElement, useEffect } from "react";
import { useAppDispatch } from '../../redux/hooks'
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeAuthenticationCode } from "../../authentication/edl";
import { OAuthTokenExchangeFailed } from "../../authentication/exception";
import { Session } from "../../authentication/session";

export default function AuthorizationCodeHandler(): ReactElement {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    function resetAuth() {
      Session.invalidateCurrentSession()
    }

    const code = searchParams.get('code');
    if (code === null) {
      return resetAuth();
    }

    exchangeAuthenticationCode(code)
        .then(async () => {
          navigate(`/customizeProduct/selectScenes`);
        })
        .catch((ex) => {
          if (ex instanceof OAuthTokenExchangeFailed) {
            console.debug('OAuth exchanged failed');
          } else if (ex instanceof TypeError) {
            console.debug('Network error')
          }
          // TODO: improve this handling
          resetAuth();
        });
  }, [dispatch, searchParams]);

  return (
    <p>Logging you into SWODLR...</p>
  )
}
