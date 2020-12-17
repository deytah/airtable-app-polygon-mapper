import React from 'react';
import {ConfirmationDialog} from "@airtable/blocks/ui";

export function ChangesConfirmationDialog({onCancel, onConfirm}) {

  return (
    <ConfirmationDialog
      title="Unsaved Changes"
      body="You have unsaved changes. Do you want to discard them?"
      cancelButtonText="Keep Editing"
      confirmButtonText="Discard Changes"
      onCancel={onCancel}
      onConfirm={onConfirm}/>
  )
}
