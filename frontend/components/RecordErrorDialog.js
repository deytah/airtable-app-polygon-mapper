import React from 'react';
import {
	Box,
	Button,
	Dialog,
	Heading,
	RecordCardList,
	Text
} from '@airtable/blocks/ui';

export default function RecordErrorDialog({
	records,
	closeDialog
}) {
	const height = (records.length <= 3 ? records.length*90+14 : 300).toString() + 'px';

	return (
		<Dialog onClose={closeDialog} minWidth="320px" maxWidth="530px">
			<Dialog.CloseButton />
			<Heading paddingTop={2} >Invalid GeoJSON detected</Heading>
			<Text paddingBottom={2}>
				The following records are omitted from the map. Review and edit their GeoJSON to reenable them.
			</Text>
			<Box height={height} border="thick" backgroundColor="lightGray1">
        <RecordCardList records={records} />
			</Box>
			<Button marginY={2} onClick={closeDialog}>Close</Button>
		</Dialog>
	)
}