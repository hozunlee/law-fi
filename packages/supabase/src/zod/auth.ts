import { z } from "zod";

export const emailSchema = z.string().email("유효한 이메일을 입력해주세요.");
export const otpSchema = z.string().length(6, "6자리 숫자를 입력해주세요.");
export const passwordSchema = z.string().min(8, "비밀번호는 8자 이상이어야 합니다.");
export const termsSchema = z.boolean().refine((val) => val === true, {
  message: "필수 약관에 동의해야 합니다.",
});
