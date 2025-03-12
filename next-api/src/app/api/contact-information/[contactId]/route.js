import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    //get params id
    const contactId = parseInt(params.contactId);
    //get detail post
    const contact_information = await prisma.contact_information.findUnique({
        where: {
            ContactID: contactId,
        },
    });

    if(!contact_information){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Contact Not Found!",
                data: null,
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json(
        {
            success:true,
            message: "Detail Data Contact",
            data: contact_information,
        },
        {
            status: 200,
        }
    );
}

// update data
export async function PATCH(request, { params }) {
    const contactId = parseInt(params.contactId);

    const { 
        SiteAccountID,  
        Salutation,
        FirstName,
        LastName,
        Email,
        PreferredLanguage,
        Phone,
        Mobile,
        WorkPhone,
        WorkExtension,
        OtherPhone,
        OtherExtension,
        Fax,
        AddressLine1,
        AddressLine2,
        City,
        StateProvince,
        Country,
        ZipPostalCode
    } = await request.json();

    //update data
    const contact_information = await prisma.contact_information.update({
        where: {
            ContactID: contactId,
        },
        data: {
            SiteAccountID: SiteAccountID,  
            Salutation: Salutation,
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            PreferredLanguage: PreferredLanguage,
            Phone: Phone,
            Mobile: Mobile,
            WorkPhone: WorkPhone,
            WorkExtension: WorkExtension,
            OtherPhone: OtherPhone,
            OtherExtension: OtherExtension,
            Fax: Fax,
            AddressLine1: AddressLine1,
            AddressLine2: AddressLine2,
            City: City,
            StateProvince: StateProvince,
            Country: Country,
            ZipPostalCode: ZipPostalCode
        }
    })

    return NextResponse.json(
        {
            success: true,
            message: "Data Contact Information Updated!",
            data: contact_information,
        },
        {
            status: 200,
        }
    )
}

//delete data
export async function DELETE(request, { params }) {
    const contactId = parseInt(params.contactId);
    
    await prisma.caseinformation.delete({
        where: {
            ContactID: contactId,
        }
    });

    return NextResponse.json(
        {
        success: true,
        message: "Data Contact Information Deleted"
        },
        {
            status: 200
        }
    );
}