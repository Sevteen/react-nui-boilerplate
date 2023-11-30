import { css } from "@emotion/css";

export const styles = {
   app: css`
      font-family: "Poppins", sans-serif;
   `,
   spawnLocations: css`
      text-transform: uppercase;
      position: absolute;
      min-width: 30vh;
      width: fit-content;
      max-width: 35vh;
      top: 10vh;
      left: 10vh;
      background-color: #141517f2;
      border-radius: 5px;
      box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
      border-radius: 0.8vh;
      padding: 30px;
      cursor: default;
      transition: 300ms;

      .location {
         width: 100%;
         margin-bottom: 15px;
         transition: 200ms;
         border-radius: 0.3vh;
         cursor: pointer;
         padding: 10px;

         &:hover {
            background-color: #1f3c47 !important;
            transition: 300ms;
         }

         .btn__content {
            font-size: 15px !important;
            font-weight: 700 !important;
            color: white !important;
            letter-spacing: 3;
         }

         &.selected {
            background-color: #1f3c47 !important;
         }
      }

      .submit-spawn {
         background-color: #086300 !important;
         width: 100%;
         margin-top: 1.5vh;
         transition: 0.2s;
         border-radius: 0.3vh;
         cursor: pointer;
         padding: 10px;
         color: #ededed;
      }

      .spawn_locations-header {
         width: 100%;
         transition: 0.2s;
         margin-bottom: 17.5px;

         p {
            font-family: "Poppins", sans-serif;
            letter-spacing: 1px;
            font-weight: bold;
            position: relative;
            color: #ededed;
            text-align: center;
            font-size: 1.5vh;
         }
      }

      &.slide-top-fade-enter-active {
         transition: all 0.3s ease-out;
      }

      &.slide-top-fade-leave-active {
         transition: all 0.5s cubic-bezier(1, 0.7, 0.9, 1);
      }

      &.slide-top-fade-enter-from,
      &.slide-top-fade-leave-to {
         transform: translateY(-10%);
         opacity: 0 !important;
      }
   `,
};
