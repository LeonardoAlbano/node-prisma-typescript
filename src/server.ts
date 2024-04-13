import fastify from "fastify";
import { z } from "zod"
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})

app.post('/cadastro', async (request, reply) => {
    const createEventSchema = z.object({
        name: z.string(),
        email: z.string(),
        number: z.number().int().positive(),
        typeFornecedor: z.string(),
        message: z.string().nullable(),
    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.fornecedores.create({
        data: {
            name: data.name,
            email: data.email,
            number: data.number.toString(),
            typeFornecedor: data.typeFornecedor,
            message: data.message,
            slug: new Date().toISOString(),
        },
    })

    return reply.status(201).send({ eventId: event.id})
})

app.listen({port: 3333 }).then(() => {
    console.log('HTTP server running!')
})