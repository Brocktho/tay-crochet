'use client'

import * as React from 'react'

import { type ReactNode, useId } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '#app/components/ui/command'
import { Icon } from '#app/components/ui/icon.tsx'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import { cn } from '#app/utils/misc.tsx'

export type SelectOption<T extends string> = {
	value: T
	label: ReactNode
}

export type ComboboxProps<T extends string> = {
	data: SelectOption<T>[]
	placeholder?: string
	emptyText?: ReactNode
	label?: ReactNode
	id?: string
}

export function Combobox<T extends string>({
	data,
	placeholder,
	emptyText,
	label,
	id,
	...rest
}: ComboboxProps<T>) {
	const backupId = useId()
	const safeId = id ?? backupId
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState('')

	return (
		<div {...rest} className={'flex flex-col gap-1'}>
			<label htmlFor={safeId}>{label}</label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={safeId}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
					>
						{value
							? data.find((item) => item.value === value)?.label
							: placeholder}
						<Icon
							name={'chevron-up'}
							className="ml-2 h-4 w-4 shrink-0 opacity-50"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>{emptyText}</CommandEmpty>
							<CommandGroup>
								{data.map((item) => (
									<CommandItem
										key={`${item.value}`}
										value={item.value}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? '' : currentValue)
											setOpen(false)
										}}
									>
										<Icon
											name={'check'}
											className={cn(
												'mr-2 h-4 w-4',
												value === item.value ? 'opacity-100' : 'opacity-0',
											)}
										/>
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
