'use client'

import { Box, Button, Output } from "./modules.tsx";
import { test, calculate } from "./scripts.ts"

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
        onClickFunc={calculate} />
      <Output
        id="out"
        text={"Ergebnis"}/>

    </>
  );
}
