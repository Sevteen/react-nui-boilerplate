/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from "react";
import { VIDEO_SINEMATIC } from "../assets/index";
import {
    SET_REGISTRATION_ERROR,
    SET_REGISTRATION_FIELD,
    SET_REGISTRATION_LOADING,
    SET_REGISTRATION_TRANSLATION,
    SET_SHOW_REGISTRATION,
    registrationReducer,
} from "../reducer/index";

interface RegistrationForm {
    firstName: string;
    lastName: string;
    date: Date;
    height: string;
    gender: "male" | "female";
}

let translations: any = {};

export const Character = () => {
    const registrationInitState = {
        error: "",
        isLoading: false,
        textLoading: "",
        dataForm: {
            firstName: "",
            lastName: "",
            date: new Date(),
            height: "",
            gender: "male",
        },
        translations: {},
    };
    const [registrationState, registrationDispatch] = useReducer(
        registrationReducer,
        registrationInitState
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        registrationDispatch({
            type: SET_REGISTRATION_FIELD,
            field: e.target.name,
            value: e.target.value,
        });
    };

    const validateForm = (dataForm: RegistrationForm) => {
        let error = "";
        if (!dataForm.firstName) {
            error = registrationState.translations["firstNameError"];
        } else if (!/^[a-zA-Z]{2,10}(?:\s[a-zA-Z]{2,10})*$/.test(dataForm.firstName)) {
            error = registrationState.translations["firstNameFormatError"];
        } else if (!dataForm.lastName) {
            error = registrationState.translations["lastNameError"];
        } else if (!/^[a-zA-Z]{2,10}(?:\s[a-zA-Z]{2,10})*$/.test(dataForm.lastName)) {
            error = registrationState.translations["lastNameFormatError"];
        } else if (!dataForm.date) {
            error = registrationState.translations["dateOfBirthError"];
        } else if (
            new Date(dataForm.date).getFullYear() < 1950 ||
            new Date(dataForm.date).getFullYear() > 2015
        ) {
            error = registrationState.translations["dateOfBirthFormatError"];
        } else if (!dataForm.height) {
            error = registrationState.translations["heightError"];
        } else if (!/^\d+$/.test(dataForm.height)) {
            error = registrationState.translations["heightFormatError"];
        } else if (parseInt(dataForm.height, 10) < 100 || parseInt(dataForm.height, 10) > 250) {
            error = registrationState.translations["heightRangeError"];
        }

        registrationDispatch({
            type: SET_REGISTRATION_ERROR,
            error,
        });

        return Boolean(error);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { dataForm } = registrationState;
        if (validateForm(dataForm)) {
            return null;
        }

        const registerData = {
            firstname: dataForm.firstName,
            lastname: dataForm.lastName,
            birthdate: dataForm.date,
            height: dataForm.height,
            gender: dataForm.gender,
        };

        fetch("https://ns_system/createNewCharacter", {
            method: "POST",
            body: JSON.stringify(registerData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp === "ok") {
                    registrationDispatch({ type: SET_SHOW_REGISTRATION, showRegistration: false });
                }
            });
    };

    const translate = (phrase: string) => {
        return registrationState.translations[phrase] || translations![phrase] || phrase;
    };

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            let loadingProgress = 0;
            let loadingDots = 0;

            const action = event.data.action;
            const payload = event.data;
            switch (action) {
                case "ui":
                    registrationDispatch({
                        type: SET_REGISTRATION_TRANSLATION,
                        translations: payload.translations,
                    });

                    translations = payload.translations;

                    if (payload.toggle) {
                        registrationDispatch({
                            type: SET_REGISTRATION_LOADING,
                            isLoading: true,
                            textLoading: translate("retrievingPlayerdata"),
                        });

                        // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
                        let DotsInterval = setInterval(function () {
                            loadingDots++;
                            loadingProgress++;
                            if (loadingProgress == 3) {
                                registrationDispatch({
                                    type: SET_REGISTRATION_LOADING,
                                    isLoading: true,
                                    textLoading: translate("validatingPlayerdata"),
                                });
                            }
                            if (loadingProgress == 4) {
                                registrationDispatch({
                                    type: SET_REGISTRATION_LOADING,
                                    isLoading: true,
                                    textLoading: translate("retrievingCharacters"),
                                });
                            }
                            if (loadingProgress == 6) {
                                registrationDispatch({
                                    type: SET_REGISTRATION_LOADING,
                                    isLoading: true,
                                    textLoading: translate("validatingCharacters"),
                                });
                            }
                            if (loadingDots == 4) {
                                loadingDots = 0;
                            }
                        }, 500);

                        setTimeout(() => {
                            registrationDispatch({
                                type: SET_REGISTRATION_LOADING,
                                isLoading: false,
                                textLoading: "",
                            });

                            setTimeout(() => {
                                registrationDispatch({
                                    type: SET_SHOW_REGISTRATION,
                                    showRegistration: true,
                                });
                            });
                        }, 6000);
                    }

                    break;

                default:
                    break;
            }
        };

        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
        };
    }, [registrationDispatch]);

    return (
        <div id='ns_character-root' className={registrationState.showRegistration || registrationState.isLoading ? "w-screen h-screen overflow-hidden relative" : ''}>
            {registrationState.isLoading && (
                <div className="welcomescreen">
                    <div className="loading-container">
                        <div className="loading-circle">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <p>{registrationState.textLoading}</p>
                    </div>
                </div>
            )}
            {registrationState.showRegistration && (
                <div className="registration">
                    <video autoPlay loop muted className="w-screen h-screen object-fill">
                        <source src={VIDEO_SINEMATIC} type="video/mp4" />
                    </video>
                    <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex justify-between items-center bg-primary/70 px-[10vw]">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col items-center justify-center gap-5 max-w-[40vw] h-max text-center"
                        >
                            <h1 className="font-bold text-[4vh] text-white mb-2">
                                {translate("createCharacter")}
                            </h1>
                            <div className="flex flex-col gap-3">
                                {registrationState.error && (
                                    <div className="p-1 rounded-md w-[25vw] outline-none font-medium bg-red-700 text-white flex items-center gap-2 justify-center mb-3 animate-bounce">
                                        <p className="flex-1 text-left text-xs">{registrationState.error}</p>
                                        <svg
                                            onClick={() =>
                                                registrationDispatch({
                                                    type: SET_REGISTRATION_ERROR,
                                                    error: "",
                                                })
                                            }
                                            className="cursor-pointer"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-width="0"
                                            viewBox="0 0 15 15"
                                            height="25px"
                                            width="25px"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder={translate("firstNamePlaceholder")}
                                    onChange={handleChange}
                                    className={className.input}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder={translate("lastNamePlaceholder")}
                                    className={className.input}
                                    onChange={handleChange}
                                />
                                <input
                                    type="date"
                                    name="date"
                                    placeholder={translate("dateOfBirthPlaceholder")}
                                    className={className.input}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="height"
                                    placeholder={translate("heightPlaceholder")}
                                    className={className.input}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="max-w-[30vw] flex flex-col gap-5">
                                <div className="flex gap-3 w-full">
                                    <span
                                        className={
                                            registrationState.dataForm.gender === "male"
                                                ? className.gender.active
                                                : className.gender.default
                                        }
                                        onClick={() =>
                                            handleChange({ target: { name: "gender", value: "male" } })
                                        }
                                    >
                                        {translate("male")}
                                    </span>
                                    <span
                                        className={
                                            registrationState.dataForm.gender === "female"
                                                ? className.gender.active
                                                : className.gender.default
                                        }
                                        onClick={() =>
                                            handleChange({ target: { name: "gender", value: "female" } })
                                        }
                                    >
                                        {translate("female")}
                                    </span>
                                </div>
                                <button
                                    type="submit"
                                    className="py-2 text-center rounded-md bg-green-600 shadow-md active:scale-95 text-white w-full"
                                >
                                    {translate("save")}
                                </button>
                            </div>
                        </form>
                        <div className="max-w-[25vw] text-white flex flex-col gap-2">
                            <h1 className="px-2 font-bold text-[3.5vh]">{translate("serverName")}</h1>
                            <div className="border-t border-white p-2 bg-gradient-to-b from-[#1F3C47]/50 text-[1.5vh] leading-5">
                                {translate("serverInfo")}
                            </div>
                            <div className="flex gap-2 px-2">
                                <a href="" className={className.link}>
                                    <DiscordIcon />
                                </a>
                                <a href="" className={className.link}>
                                    <YoutubeIcon />
                                </a>
                                <a href="" className={className.link}>
                                    <InstagramIcon />
                                </a>
                                <a href="" className={className.link}>
                                    <StoreIcon />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const className = {
    input: "p-3 rounded-md w-[25vw] outline-none font-medium bg-[#1F3C47] shadow-md text-white",
    gender: {
        default:
            "p-3 rounded-md border border-white w-full text-center text-white cursor-pointer hover:scale-105 transition-all duration-300",
        active:
            "p-3 rounded-md border border-white w-full text-center text-primary bg-white cursor-pointer font-bold hover:scale-105 transition-all duration-300",
    },
    link: "p-3 border w-max block hover:scale-105 transition-all duration-300",
};

const DiscordIcon = () => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 640 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
    </svg>
);

const YoutubeIcon = () => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 576 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
    </svg>
);

const InstagramIcon = () => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M13.0281 2.00098C14.1535 2.00284 14.7238 2.00879 15.2166 2.02346L15.4107 2.02981C15.6349 2.03778 15.8561 2.04778 16.1228 2.06028C17.1869 2.10944 17.9128 2.27778 18.5503 2.52528C19.2094 2.77944 19.7661 3.12278 20.3219 3.67861C20.8769 4.23444 21.2203 4.79278 21.4753 5.45028C21.7219 6.08694 21.8903 6.81361 21.9403 7.87778C21.9522 8.14444 21.9618 8.36564 21.9697 8.58989L21.976 8.78397C21.9906 9.27672 21.9973 9.8471 21.9994 10.9725L22.0002 11.7182C22.0003 11.8093 22.0003 11.9033 22.0003 12.0003L22.0002 12.2824L21.9996 13.0281C21.9977 14.1535 21.9918 14.7238 21.9771 15.2166L21.9707 15.4107C21.9628 15.6349 21.9528 15.8561 21.9403 16.1228C21.8911 17.1869 21.7219 17.9128 21.4753 18.5503C21.2211 19.2094 20.8769 19.7661 20.3219 20.3219C19.7661 20.8769 19.2069 21.2203 18.5503 21.4753C17.9128 21.7219 17.1869 21.8903 16.1228 21.9403C15.8561 21.9522 15.6349 21.9618 15.4107 21.9697L15.2166 21.976C14.7238 21.9906 14.1535 21.9973 13.0281 21.9994L12.2824 22.0002C12.1913 22.0003 12.0973 22.0003 12.0003 22.0003L11.7182 22.0002L10.9725 21.9996C9.8471 21.9977 9.27672 21.9918 8.78397 21.9771L8.58989 21.9707C8.36564 21.9628 8.14444 21.9528 7.87778 21.9403C6.81361 21.8911 6.08861 21.7219 5.45028 21.4753C4.79194 21.2211 4.23444 20.8769 3.67861 20.3219C3.12278 19.7661 2.78028 19.2069 2.52528 18.5503C2.27778 17.9128 2.11028 17.1869 2.06028 16.1228C2.0484 15.8561 2.03871 15.6349 2.03086 15.4107L2.02457 15.2166C2.00994 14.7238 2.00327 14.1535 2.00111 13.0281L2.00098 10.9725C2.00284 9.8471 2.00879 9.27672 2.02346 8.78397L2.02981 8.58989C2.03778 8.36564 2.04778 8.14444 2.06028 7.87778C2.10944 6.81278 2.27778 6.08778 2.52528 5.45028C2.77944 4.79194 3.12278 4.23444 3.67861 3.67861C4.23444 3.12278 4.79278 2.78028 5.45028 2.52528C6.08778 2.27778 6.81278 2.11028 7.87778 2.06028C8.14444 2.0484 8.36564 2.03871 8.58989 2.03086L8.78397 2.02457C9.27672 2.00994 9.8471 2.00327 10.9725 2.00111L13.0281 2.00098ZM12.0003 7.00028C9.23738 7.00028 7.00028 9.23981 7.00028 12.0003C7.00028 14.7632 9.23981 17.0003 12.0003 17.0003C14.7632 17.0003 17.0003 14.7607 17.0003 12.0003C17.0003 9.23738 14.7607 7.00028 12.0003 7.00028ZM12.0003 9.00028C13.6572 9.00028 15.0003 10.3429 15.0003 12.0003C15.0003 13.6572 13.6576 15.0003 12.0003 15.0003C10.3434 15.0003 9.00028 13.6576 9.00028 12.0003C9.00028 10.3434 10.3429 9.00028 12.0003 9.00028ZM17.2503 5.50028C16.561 5.50028 16.0003 6.06018 16.0003 6.74943C16.0003 7.43867 16.5602 7.99944 17.2503 7.99944C17.9395 7.99944 18.5003 7.43954 18.5003 6.74943C18.5003 6.06018 17.9386 5.49941 17.2503 5.50028Z"></path>
    </svg>
);

const StoreIcon = () => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M464 448V267.85a104.76 104.76 0 01-33.56 6.58c-1.18 0-2.3.05-3.4.05a108 108 0 01-56.86-16 108 108 0 01-56.85 16 106.16 106.16 0 01-56.51-16.2 107.84 107.84 0 01-57.2 16.2 106.14 106.14 0 01-56.85-16.42 106.14 106.14 0 01-56.85 16.42c-1.09 0-2.19 0-3.37-.05h-.06A104.66 104.66 0 0148 267.49V448H16v32h480v-32zm-240-64h-96v-76a4 4 0 014-4h88a4 4 0 014 4zm160 64h-80V308a4 4 0 014-4h72a4 4 0 014 4zm108.57-277.72L445.89 64C432 32 432 32 400 32H112c-32 0-32 0-45.94 32L19.38 170.28c-9 19.41 2.89 39.34 2.9 39.35l.41.66c.42.66 1.13 1.75 1.62 2.37.1.13.19.27.28.4l5.24 6.39 5.31 5.14.42.36a69.65 69.65 0 009.44 6.78v.05a74 74 0 0036 10.67h2.47a76.08 76.08 0 0051.89-20.31 72.38 72.38 0 005.77-6 74.18 74.18 0 005.78 6 76.08 76.08 0 0051.89 20.31c23.28 0 44.07-10 57.63-25.56a.11.11 0 01.15 0l5.66 5.26a76.09 76.09 0 0051.9 20.31c23.29 0 44.11-10 57.66-25.61 13.56 15.61 34.37 25.61 57.67 25.61h2.49a71.35 71.35 0 0035-10.7c.95-.57 1.86-1.17 2.78-1.77A71.33 71.33 0 00488 212.17l2-3c.9-2.04 11.21-20.3 2.57-38.89z"></path>
    </svg>
);
