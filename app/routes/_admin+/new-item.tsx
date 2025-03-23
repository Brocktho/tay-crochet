import {useIsPending} from "#app/utils/misc.tsx";
import {useSearchParams} from "react-router";
import {useForm} from "@conform-to/react";
import {getZodConstraint, parseWithZod} from "@conform-to/zod";
import { type Route } from './+types/new-item.ts'

export function loader({} : Route.LoaderArgs){}

export function action({} : Route.ActionArgs){

}

export default function NewItemPage({ actionData }: Route.ComponentProps)
{
    const isPending = useIsPending()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirectTo')

    const [form, fields] = useForm({
        id: 'login-form',
        constraint: getZodConstraint(LoginFormSchema),
        defaultValue: { redirectTo },
        lastResult: actionData?.result,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: LoginFormSchema })
        },
        shouldRevalidate: 'onBlur',
    })
    return(
        <div className={"flex flex-row items-center justify-between"}>

        </div>
    )

}