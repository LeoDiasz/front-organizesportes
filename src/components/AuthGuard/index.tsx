import { useEffect, type ReactNode } from "react"
import { PAGE } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { OrganizationService } from "../../services/organization.service";
import { useUserStore } from "../../store/userStore";

interface IAppGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: IAppGuardProps) => {
    const { setOrganization, setIsLoading } = useUserStore();
    const organizationService = OrganizationService.getInstance();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoading(true);
            organizationService.getOrganization().then(response => {
                setOrganization(response);

                if (location.pathname === PAGE.CREATE_ORGANIZATION() || location.pathname === PAGE.LOGIN()) {
                    navigate(PAGE.HOME())
                }
            }).catch(() => {
                if(location.pathname === PAGE.CREATE_ORGANIZATION()) {
                    return;
                }
                navigate(PAGE.CREATE_ORGANIZATION())
            }).finally(() => {
                setIsLoading(false);
            })
        } else {
            navigate(PAGE.LOGIN());
        }

    }, [])


    return (
        <>{children}</>
    )
}