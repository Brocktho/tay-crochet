import {
	Content,
	Portal,
	Provider,
	Root,
	Trigger,
} from '@radix-ui/react-tooltip'
import { Icon } from '#app/components/ui/icon.tsx'
import { ReactNode } from 'react'

export type InfoIconProps = {
	tooltip: ReactNode
}

export default function InfoIcon({ tooltip }: InfoIconProps) {
	return (
		<Provider>
			<Root>
				<Trigger asChild>
					<Icon name={'info-circled'} />
				</Trigger>
				<Portal>
					<Content alignOffset={24}>{tooltip}</Content>
				</Portal>
			</Root>
		</Provider>
	)
}
