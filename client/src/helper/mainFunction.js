import { useNavigate } from "react-router-dom";

export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export const deleteCookie = (cname) => {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export function formatDateToCustom(dateStr) {
    const dateObj = new Date(dateStr);

    // Format the date
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return formattedDate;
}

export const checkLogin = () => {
    const token = getCookie("token");
    if (token) {
        return;
    } else {
        window.location.href = "/";
    }
}