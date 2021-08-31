import com.ms.forgerock.mappings.targets.fwd.properties.UidProperty
import com.ms.forgerock.objects.Systemid

UidProperty property = new UidProperty(new Systemid(source))
return property.build()