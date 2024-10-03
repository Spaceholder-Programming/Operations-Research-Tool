'use client'

import { Box, Button, Output } from "./modules";
import { calculate_click, downloadLP, import_click } from "./scripts"

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="title">
          <main className="header_box">
            Operations Research Tool
            <br></br>
            <span className="header_copyright">
              <i>by Spaceholder Programming</i>
            </span>
          </main>
        </div>
      </header>
      <Box
        title={"Objective"}
        placeholder={"Objective"}
        id="objective"/>
      <Box
        title={"Subject"}
        placeholder={"Subject"}
        id="subject"/>
      <Box
        title={"Bounds"}
        placeholder={"Bounds"}
        id="bounds"/>
      <Box
        title={"Variables"}
        placeholder={"Your Variables here"}
        id="vars" />
      <Button
        title={"Calculate"}
        className={"button_green"}
        onClickFunc={calculate_click} />
      {/* <Popup_Button
        title={"Import"}
        className={"button"} /> */}
      <Button
        title={"Export as LP"}
        className={"button"}
        onClickFunc={downloadLP} />
      <br></br>
      <Output
        id="out"
        text={"Ergebnis"}/>
      {/* <Popup_Button
        title="Popup"
        className="button"
        /> */}

    </>
  );
}
