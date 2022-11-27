import {Button, styled, TextField} from "@mui/material";

const ColorButton = styled(Button)(({ theme }) => ({
	color: "#000000",
	backgroundColor: "#fc7676",
	'&:hover': {
		backgroundColor: "#c25b5b",
	},
}));

/**
 * Themed button with red colors for hover and click, shadow removed from default state, still present on hover.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ShColorButtonNoFullWidth(props) {
    return <ColorButton {...props} sx={{ boxShadow: 0 }} />
}

/**
 * Themed button with red colors for hover and click, shadow removed from default state, still present on hover.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ShColorButton(props) {
    return <ShColorButtonNoFullWidth {...props} fullWidth />
}

/**
 * Themed div with a 5px borderRadius and white background color.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ShThemeDiv(props) {
	const newStyle = (props.style === undefined) ? {} : {...props.style}
	if (newStyle.backgroundColor === undefined)
		newStyle.backgroundColor = "#FFFFFF"
	if (newStyle.borderRadius === undefined)
		newStyle.borderRadius = "5px"

	const newProps = {...props}
	newProps.style = newStyle

	return <div
		{...newProps}
	/>
}

/**
 * Base text field, uses fullwidth and the outlined theme.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ShTextField(props) {
	return <TextField
		{...props}
		fullWidth
		className="TextField"
		variant="outlined"
	/>
}