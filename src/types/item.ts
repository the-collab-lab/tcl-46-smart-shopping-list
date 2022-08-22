import { Timestamp } from 'firebase/firestore';

export interface Item {
	dateCreated: Timestamp;
	dateLastPurchased?: Timestamp | null;
	dateNextPurchased: Timestamp | null;
	isChecked: boolean;
	name: string;
	totalPurchases: number;
	refTime?: number;
	daysToNext?: number;
}
