import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

const DatePicker = (props) => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        name={props.name}
        disableToolbar={props.disableToolbar}
        variant={props.variant}
        format={props.format}
        margin={props.margin || "none"}
        id={props.id}
        label={props.label}
        required={props.required}
        value={props.date}
        inputVariant="outlined"
        disablePast={props.disablePast}
        disableFuture={props.disableFuture}
        invalidDateMessage={props.invalidDateMessage}
        onChange={(date) => {
          props.onChangeDate(date);
        }}
        disabled={props.disabled}
        cancelLabel={props.cancelLabel}
        okLabel={props.okLabel}
        style={props.style}
      />
    </MuiPickersUtilsProvider>
  );
};

export { DatePicker };
