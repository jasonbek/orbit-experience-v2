export interface Milestone {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export const milestones: Milestone[] = [
    {
        id: '1',
        title: 'Earth Orbit',
        description: 'Establish stable low earth orbit.',
        isCompleted: false,
    },
    {
        id: '2',
        title: 'Lunar Injection',
        description: 'Perform trans-lunar injection burn.',
        isCompleted: false,
    },
    // Add more milestones as needed
];
