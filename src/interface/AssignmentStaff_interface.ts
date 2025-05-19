

export interface AssignmentFormData {
    staffId: number;
    serviceId: number;
    assignedDate: string;
    note?: string;
}

export interface AssignmentStaffData {
    id: number;
    staffId: number;
    serviceId: number;
    staffName: string;
    serviceName: string;
    assignedDate: string;
    note?: string;
    status : string; 
}
