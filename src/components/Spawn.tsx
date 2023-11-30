/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReducer } from "react";
import useNuiEvent from "../hooks/useNuiEvent";
import {
    SET_SPAWN_NEW_CHAR,
    SET_SPAWN_POSITIONS,
    SET_SPAWN_SELECTED,
    SET_SPAWN_SHOW,
    spawnReducer,
} from "../reducer";
import { fetchNui } from "../utils";
import { styles } from "../styles";

export const Spawn = () => {
    const spawnInitState = {
        positions: {
            normal: [],
            apartment: [],
            house: [],
        },
        selectedValue: {
            type: "",
            name: "",
        },
        newChar: false,
        show: false,
    };

    const [spawnState, spawnDispatch] = useReducer(spawnReducer, spawnInitState);

    const onClickLocation = async (type: string, name: string) => {
        spawnDispatch({ type: SET_SPAWN_SELECTED, payload: { type, name } });

        if (type === "normal") {
            await fetchNui("setCam", { postname: name, type: type });
        }
    };

    const submitSpawn = async () => {
        spawnDispatch({ type: SET_SPAWN_SHOW, payload: false });

        const data = spawnState.selectedValue;

        if (data.type) {
            await fetchNui("spawnplayer", {
                spawnloc: data.name,
                typeLoc: data.type,
            });
        }
    };

    useNuiEvent("showUI", (data) => {
        spawnDispatch({ type: SET_SPAWN_SHOW, payload: data.status });
    });

    useNuiEvent("setupLocations", (data) => {
        spawnDispatch({
            type: SET_SPAWN_POSITIONS,
            payload: { normal: data.locations || [], apartment: data.apartment || [], house: data.houses || [] },
        });
        spawnDispatch({ type: SET_SPAWN_SELECTED, payload: { type: "", name: "" } });
        spawnDispatch({ type: SET_SPAWN_NEW_CHAR, payload: data.isNew });
    });



    return (
        <div className={styles.app} id="ns_spawn-root">
            {spawnState.show && <div
                className={`${styles.spawnLocations} spawn-location ${spawnState.show === false ? "slid-top-fade-leave-active slide-top-fade-leave-to" : ""
                    }`}
            >
                <div className="spawn_locations-header">
                    <p>
                        <span id="null">Where would you like to start?</span>
                    </p>
                </div>

                {!spawnState.newChar && <button
                    className={`location ${"current" === spawnState.selectedValue.type &&
                        "current" === spawnState.selectedValue.name
                        ? "selected"
                        : ""
                        }`}
                    onClick={() => onClickLocation("current", "current")}
                    type="button"
                >
                    <div className="btn__content">
                        Last Location
                    </div>
                </button>}

                {Object.keys(spawnState.positions).map((locationGroupIdx) => (
                    <div key={locationGroupIdx}>
                        {spawnState.positions[locationGroupIdx].map((location: any, locationIdx: any) => (
                            <button
                                key={`${locationGroupIdx}-${locationIdx}`}
                                color="#00000000"
                                className={`location ${locationGroupIdx === spawnState.selectedValue.type &&
                                    ((locationGroupIdx !== "house" &&
                                        location.name === spawnState.selectedValue.name) ||
                                        (locationGroupIdx === "house" &&
                                            location.house === spawnState.selectedValue.name))
                                    ? "selected"
                                    : ""
                                    }`}
                                onClick={() =>
                                    onClickLocation(
                                        locationGroupIdx,
                                        locationGroupIdx === "house" ? location.house : location.name
                                    )
                                }
                            >
                                <div className="btn__content">
                                    {location.label}
                                </div>
                            </button>
                        ))}
                    </div>
                ))}

                <button
                    onClick={submitSpawn}
                    hidden={spawnState.selectedValue.type === "" || spawnState.selectedValue.name === ""}
                    className="submit-spawn v-btn__content"
                    type="button"
                >
                    <div className="btn__content">
                        Confirm
                    </div>
                </button>
            </div>}
        </div>
    );
};
