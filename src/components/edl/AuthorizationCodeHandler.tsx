import { ReactElement, useEffect } from "react";
import { useAppDispatch } from '../../redux/hooks'
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeAuthenticationCode } from "../../authentication/edl";
import { OAuthTokenExchangeFailed } from "../../authentication/exception";
import { Session } from "../../authentication/session";
import { spatialSearchCollectionConceptId, spatialSearchResultLimit } from "../../constants/rasterParameterConstants";
import { setUserHasCorrectEdlPermissions } from "../app/appSlice";

const checkUseHasCorrectEdlPermissions = async () => {
  try {
    // get session token to use in spatial search query
    const session = await Session.getCurrent();
    if (session === null) {
      throw new Error('No current session');
    }
    const authToken = await session.getAccessToken();
    if (authToken === null) {
      throw new Error('Failed to get authentication token');
    }

    const polygonUrlString = '&polygon[]=-49.921875,68.58850924263909,-50.06469726562501,68.56844733448305,-50.06469726562501,68.52223694881727,-49.91638183593751,68.52424806853186,-49.921875,68.58850924263909'
    const spatialSearchUrl = `https://cmr.earthdata.nasa.gov/search/granules?collection_concept_id=${spatialSearchCollectionConceptId}${polygonUrlString}&page_size=${spatialSearchResultLimit}`
    const userHasCorrectEdlPermissions = await fetch(spatialSearchUrl, {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then(response => response.text()).then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const userHasCorrectEdlPermissions = parseInt(xml.getElementsByTagName("hits")[0].textContent ?? '0') > 0
      return userHasCorrectEdlPermissions
    })
    return userHasCorrectEdlPermissions
  } catch (err) {
    if (err instanceof Error) {
        // return err
        return false
      } else {
        // return 'something happened'
        return false
      }
  }
}

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
          const userHasCorrectEdlPermissions = await checkUseHasCorrectEdlPermissions()
          dispatch(setUserHasCorrectEdlPermissions(userHasCorrectEdlPermissions))
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
