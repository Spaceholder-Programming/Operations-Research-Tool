'use client'

import { Box, Button, Output, Popup_Button } from "./modules.tsx";
import { calculate_click, import_click, export_click } from "./scripts.ts"

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
        title={"Functions"}
        placeholder={"Your Functions here"}
        id="funcs"/>
      <Box
        title={"Variables"}
        placeholder={"Your Variables here"}
        id="vars" />
      <Button
        title={"Calculate"}
        className={"button_green"}
        onClickFunc={calculate_click} />
      <Popup_Button
        title={"Import"}
        className={"button"} />
      <Popup_Button
        title={"Export"}
        className={"button"} />
      <br></br>
      <Output
        id="out"
        text={"Ergebnis"}/>
      <Popup_Button
        title="Popup"
        className="button"
        />

    </>
  );
}
