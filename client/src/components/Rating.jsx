import { useState } from 'react';

const Rating = ({ value, onChange, readonly = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= (hover || value) ? 'filled' : ''}
                    onClick={() => !readonly && onChange && onChange(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    style={{ cursor: readonly ? 'default' : 'pointer' }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default Rating;
