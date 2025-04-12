import dayjs from "dayjs";

export const FORMATE_DATE = "YYYY-MM-DD";

export const FORMATE_DATE_VN = "DD-MM-YYYY";

export const dateRangeValidate = (dataRange: any) => {
    if (!dataRange) return undefined;

    const startDate = dayjs(dataRange[0], FORMATE_DATE).toDate();
    const endDate = dayjs(dataRange[1], FORMATE_DATE).toDate();

    return [startDate, endDate]
}