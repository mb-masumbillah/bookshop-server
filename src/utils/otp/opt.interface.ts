export type TEmailSend = {
    name:string
    email: string
    otpCode?: string | undefined
    link?: string | undefined
    expireInSeconds?: number | undefined
}