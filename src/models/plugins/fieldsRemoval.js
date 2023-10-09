export default function fieldsRemoval(schema) {
    schema.set('toJSON', {
        transform: (doc, ret) => {
            delete ret.password
            delete ret.createdAt
            delete ret.updatedAt
            delete ret.__v

            ret.id = ret._id
            delete ret._id
        }
    })
}