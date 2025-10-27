
export interface clinics{
id: number
name : string
email: string
NIF: string 
telf: number 
doctors: Array<{ id: number; name: string }>
password: string
}