'use strict';

module.exports = {isPossibleNickName, isPossibleCode, isAlphanumeric, isNumeric, capitalizeNickName};

function isPossibleNickName(str)
{
	str = str.toString();
	return isAlphanumeric(str) && str.length <= 6 && str.length > 0;
}

function isPossibleCode(str)
{
	str = str.toString().trim();
	return isNumeric(str) && str.length == 4;
}

function isAlphanumeric(str)
{
	str = str.toString().trim();
	return str.match(/^[0-9a-zA-Z]*$/) != null;
}

function isNumeric(str)
{
	str = str.toString().trim();
	return str.match(/^[0-9]*$/) != null;
}

function capitalizeNickName(name)
{
	let trimmed = name.toString().trim();
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
