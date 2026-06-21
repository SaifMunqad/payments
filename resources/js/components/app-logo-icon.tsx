import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM12 5C10.343 5 9 6.343 9 8C9 9.657 10.343 11 12 11C13.657 11 15 9.657 15 8C15 6.343 13.657 5 12 5ZM11 13H13V15H11V13ZM11 17H13V19H11V17Z"
                fill="currentColor"
            />
        </svg>
    );
}

