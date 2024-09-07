const toArrowComboboxOptions = [
    { label: '->', value: 'OpenTriangle' },
    { label: '-|', value: 'Line' },
    { label: '-<', value: 'Fork' },
    { label: '-o<', value: 'CircleFork' },
    { label: '-|<', value: 'LineFork' },
    { label: '-|o', value: 'LineCircle' },
    { label: '-||', value: 'DoubleLine' },
    { label: 'none', value: '' },
]

const fromArrowComboboxOptions = [
    { label: '<-', value: 'BackwardOpenTriangle' },
    { label: '|-', value: 'Line' },
    { label: '<-', value: 'BackwardFork' },
    { label: '>o-', value: 'BackwardCircleFork' },
    { label: '>|-', value: 'BackwardLineFork' },
    { label: 'o|-', value: 'CircleLine' },
    { label: '||-', value: 'DoubleLine' },
    { label: 'none', value: '' },
]

export { toArrowComboboxOptions, fromArrowComboboxOptions };