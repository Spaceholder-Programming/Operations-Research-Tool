import { MouseEventHandler } from "react";
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

export function Popup_Button({title, className}:
  {title:string; className:string|undefined;}) {

  return(
    <Popup
      trigger={<button
        className={className}>
          {title}
      </button>}
      position="right center"
      modal
      nested>
        {close => (
          <div className="popup_bg">
          <button  onClick={close}>
            &times;
          </button>
          <div className="header"> {title} </div>
          <div className="content">
            This is a popup example.
          </div>
          <div className="actions">
            <button className="button" onClick={close}>
              Cancel</button>
          </div>
        </div>
        )}
      </Popup>
    
  
  );
}

export function Output({id, text}:
  {id:string; text:string}) {
    
  return(
    <div className="main_div">
      <div className="body_title"
      >
        Output
      </div>
      <div className="text">
        <p
          className="output_box"
          id={id}
          value={text}>
        </p>
      </div>
    </div>
  );
}
