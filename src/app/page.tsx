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
        placeholder={"Insert your objective here. One objective is allowed. Use one line for it (no \"return\"!) Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx + y\n-786433 x1 + 655361 x2"}
        id="objective"/>
      <Box
        title={"Subject"}
        placeholder={"Insert your subject here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\n+1 x + 2 y <= 15\n524321 x14 + 524305 x15 <= 4194303.5"}
        id="subject"/>
      <Box
        title={"Bounds"}
        placeholder={"Insert your bounds here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx >= 0\nx > 0\n0 <= x1 <= 1"}
        id="bounds"/>
      <Box
        title={"Variables"}
        placeholder={"List all your variables. One per line (divide by 'return' button). Allowed symbols are a-z, A-Z.\nExample:\nx\ny"}
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
        text={"Input a problem and an action button to display output..."}/>
      {/* <Popup_Button
        title="Popup"
        className="button"
        /> */}

    </>
  );
}
