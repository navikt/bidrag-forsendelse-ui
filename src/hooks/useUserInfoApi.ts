import { useQuery } from "react-query";

interface UserInfo {
    displayName: string;
    firstname: string;
    surname: string;
    navIdent: string;
    email: string;
    officeLocation: string;
}
export default function useUserInfoApi() {
    const userInfoQuery = () => {
        return useQuery<UserInfo>({
            queryKey: "userinfo",
            queryFn: () => fetch("/me").then((res) => res.json()),
        });
    };

    const hentSaksbehandlerNavn = () => {
        const userInfo = userInfoQuery();
        return userInfo.data.displayName;
    };
    return {
        hentSaksbehandlerNavn,
    };
}
