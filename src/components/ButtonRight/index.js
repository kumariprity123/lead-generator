
import { Button } from "@mui/material";
import { useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";

const ButtonRight = () => {
    const { setUserLoginDetails, setIsUserLoggedIn } = useContext(LoginContext);
    function onButtonClick() {
        setUserLoginDetails({});
        setIsUserLoggedIn(false);

    }
    return (
        <div style={{ "textAlign": "right", "flex": "1 1 auto", margin: "5px 20px 0 0" }}>
            <Button variant="contained" onClick={() => onButtonClick()} color="error">
            Logout
            </Button>
        </div>
    )
}
export default ButtonRight;