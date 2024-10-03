import { MouseEventHandler } from "react";
import React from 'react';
import Popup from "reactjs-popup";

export function Box({title, placeholder, id}:
  {title:string; placeholder:string; id:string}) {
    return(
      <div className="main_div">
        <div className="body_title">
          {title}
        </div>
        <div className="text">
          <textarea
            className="body_box"
            id={id}
            wrap="soft"
            rows={6}
            placeholder={placeholder}
          ></textarea>
        </div>
      </div>
    );
}

export function Button({title, className, onClickFunc}:
  {title:string; className:string|undefined; onClickFunc: MouseEventHandler}) {

  return(
    <button
      className={className}
      onClick={onClickFunc}
      >
      {title}
  </button>
  
  );
}

export function Output({ id, text }: { id: string; text: string }) {
  return (
    <div className="main_div">
      <div className="body_title">Output</div>
      <div className="text">
        <p className="output_box" id={id}>
          {text}
        </p>
      </div>
    </div>
  );
}
