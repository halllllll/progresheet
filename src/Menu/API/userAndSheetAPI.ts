import { errorMapper } from "../errors";
import { serverFunctions, isGASEnvironment } from "./serverFunctions";

const getAccessedUserInfoAPI = async (): Promise<string> => {
	if (isGASEnvironment()) {
		const ret = await serverFunctions.getUserInfo();

		return ret;
	}

	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve("dummy id");
		}, 1200);
	});
};

const getSpreadSheetInfoAPI = async (): Promise<string> => {
	if (isGASEnvironment()) {
		const ret = await serverFunctions.getSpreadSheetName();

		return ret;
	}

	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve("pseudo sheet name");
		}, 300);
	});
};

const checkUniqueSheetNameAPI = async (sheetName: string): Promise<boolean> => {
	if (isGASEnvironment()) {
		const ret = await serverFunctions.isUniqueSheet(sheetName);
		if (ret.success) {
			return ret.data.isUnique;
		}
		throw errorMapper(ret.error);
	}

	return await new Promise((resolve) => {
		setTimeout(() => {
			resolve(Math.random() < 0.5);
		}, 300);
	});
};

export {
	getAccessedUserInfoAPI,
	getSpreadSheetInfoAPI,
	checkUniqueSheetNameAPI,
};
