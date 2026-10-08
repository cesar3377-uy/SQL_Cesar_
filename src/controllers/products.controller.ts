import pool from "../conf/dbConnection";


export const getAll = async (req: any, res: any) => {

    try {

        const [products]: any = await pool.query(
            "SELECT * FROM products WHERE active = ?",
            [true]
        );

        return res.status(200).json({
            ok: true,
            products: products
        });

    } catch (error: any) {

        console.error("Error al obtener productos:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const getById = async (req: any, res: any) => {

    try {

        const id: any = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                ok: false,
                message: "El ID debe ser un entero positivo"
            });
        }

        const [products]: any = await pool.query(
            "SELECT * FROM products WHERE id = ? AND active = ?",
            [id, true]
        );

        if (products.length === 0) {

            return res.status(200).json({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            product: products[0]
        });

    } catch (error: any) {

        console.error("Error al buscar producto:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const create = async (req: any, res: any) => {

    try {

        const {
            name,
            price,
            stock,
            description,
            brand,
            img
        }: any = req.body;

        const numericPrice: any = Number(price);

        if (
            !name ||
            !Number.isFinite(numericPrice) ||
            numericPrice <= 0 ||
            stock === undefined ||
            !description
        ) {

            return res.status(400).json({
                ok: false,
                message: "Datos del producto invalidos"
            });
        }

        const [result]: any = await pool.query(
            `INSERT INTO products
            (name, price, stock, description, brand, img)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                numericPrice,
                stock,
                description,
                brand || null,
                img || null
            ]
        );

        return res.status(201).json({
            ok: true,
            message: "Producto creado correctamente",
            id: result.insertId
        });

    } catch (error: any) {

        console.error("Error al crear producto:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const update = async (req: any, res: any) => {

    try {

        const id: any = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                ok: false,
                message: "El ID debe ser un entero positivo"
            });
        }

        const {
            name,
            price,
            stock,
            description,
            brand,
            img
        }: any = req.body;

        const numericPrice: any = Number(price);

        if (
            !name ||
            !Number.isFinite(numericPrice) ||
            numericPrice <= 0 ||
            stock === undefined ||
            !description
        ) {

            return res.status(400).json({
                ok: false,
                message: "Datos del producto invalidos"
            });
        }

        const [result]: any = await pool.query(
            `UPDATE products
             SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ?
             WHERE id = ? AND active = ?`,
            [
                name,
                numericPrice,
                stock,
                description,
                brand || null,
                img || null,
                id,
                true
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(200).json({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Producto actualizado correctamente"
        });

    } catch (error: any) {

        console.error("Error al actualizar producto:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const deleteProduct = async (req: any, res: any) => {

    try {

        const id: any = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                ok: false,
                message: "El ID debe ser un entero positivo"
            });
        }

        const [result]: any = await pool.query(
            "UPDATE products SET active = ? WHERE id = ? AND active = ?",
            [false, id, true]
        );

        if (result.affectedRows === 0) {

            return res.status(200).json({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Producto dado de baja correctamente"
        });

    } catch (error: any) {

        console.error("Error al dar de baja producto:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const changePrice = async (req: any, res: any) => {

    try {

        const id: any = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                ok: false,
                message: "El ID debe ser un entero positivo"
            });
        }

        const keys: any = Object.keys(req.body);

        if (keys.length !== 1 || keys[0] !== "price") {

            return res.status(400).json({
                ok: false,
                message: "El cuerpo debe contener solamente price"
            });
        }

        const { price }: any = req.body;

        const numericPrice: any = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {

            return res.status(400).json({
                ok: false,
                message: "El precio debe ser numerico y mayor que cero"
            });
        }

        const [result]: any = await pool.query(
            `UPDATE products
             SET price = ?
             WHERE id = ? AND active = ?`,
            [numericPrice, id, true]
        );

        if (result.affectedRows === 0) {

            return res.status(200).json({
                ok: false,
                message: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Precio actualizado correctamente"
        });

    } catch (error: any) {

        console.error("Error al cambiar precio:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
};