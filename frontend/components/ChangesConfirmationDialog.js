import React from 'react';
import {ConfirmationDialog} from "@airtable/blocks/ui";

export function ChangesConfirmationDialog({onCancel, onConfirm}) {

  return (
    <ConfirmationDialog
      title="Unsaved Changes"
      body="Would you like to discard changes and switch records?"
      cancelButtonText="Keep Editing"
      confirmButtonText="Discard Changes"
      onCancel={onCancel}
      onConfirm={onConfirm}/>
  )
}
