/* eslint-disable @typescript-eslint/no-explicit-any */
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";

export function SelectDropdownSearch({
	list,
	usedIn = "category",
	selected,
	setSelected,
	addNew,
	setValue,
}: {
	list: { value: string; label: string }[];
	usedIn: string;
	selected: string | null;
	setSelected: Dispatch<SetStateAction<string | null>>;
	setValue?: any;
	addNew: (name: string) => void;
}) {
	const [search, setSearch] = useState("");
	const combobox = useCombobox({
		onDropdownClose: () => {
			combobox.resetSelectedOption();
			combobox.focusTarget();
			setSearch("");
		},

		onDropdownOpen: () => {
			combobox.focusSearchInput();
		},
	});

	const options = list
		?.filter((item) =>
			item.label.toLowerCase().includes(search.toLowerCase().trim()),
		)
		.map((item) => (
			<Combobox.Option value={item.value} key={item.value}>
				{item.label}
			</Combobox.Option>
		));

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={(val) => {
				setSelected(val);
				setValue("categoryId", val, { shouldTouch: true, shouldDirty: true });
				combobox.closeDropdown();
			}}
		>
			<Combobox.Target targetType='button'>
				<InputBase
					component='button'
					type='button'
					pointer
					className='w-64'
					rightSection={<Combobox.Chevron />}
					onClick={() => combobox.toggleDropdown()}
					rightSectionPointerEvents='none'
				>
					{list?.find((item) => item.value == selected)?.label || (
						<Input.Placeholder>Pick option</Input.Placeholder>
					)}
				</InputBase>
			</Combobox.Target>

			<Combobox.Dropdown>
				<Combobox.Search
					value={search}
					onChange={(event) => setSearch(event.currentTarget.value)}
					placeholder={`search ${usedIn}`}
				/>
				<Combobox.Options>
					{options?.length > 0 ? (
						options
					) : (
						<Combobox.Empty>
							<Button
								variant={`outline`}
								size={`xs`}
								onClick={(e) => {
									e.preventDefault();
									addNew(search);
								}}
							>
								+ add new {usedIn}
							</Button>
						</Combobox.Empty>
					)}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
