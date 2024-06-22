import { type InitOptions, type InitResponse } from "../AppsScript/service";
import { errorMapper } from "../errors";
import { isGASEnvironment, serverFunctions } from "./serverFunctions";

const initAPI = async (data: InitOptions): Promise<InitResponse> => {
	if (isGASEnvironment()) {
		const ret = await serverFunctions.initConfig(data);
		if (ret.success) {
			return ret;
		}
		const err = errorMapper(ret.error);

		throw err;
	}

	return await new Promise<InitResponse>((resolve) => {
		setTimeout(() => {
			resolve({ success: true, data: undefined });
		}, 1000);
	});
};

export default initAPI;
